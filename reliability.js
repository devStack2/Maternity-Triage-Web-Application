class ReliabilityMonitor {
    constructor() {
        this.failures = [];
        this.fixTimes = [];
        this.operations = {};

        this.testStartTime = null;
        this.testEndTime = null;
        this.totalExecutionTime = 0;

        this.isUnderTest = false;
        this.failureCount = 0;
        this.lastFailureTime = null;

        this.failureIntensityObjective = null;
        this.alpha = 0.1;
        this.beta = 0.1;
        this.gamma = 2;

        this.loadFromStorage();
    }

    startTest() {
        this.testStartTime = Date.now();
        this.isUnderTest = true;
        this.failures = [];
        this.fixTimes = [];
        this.failureCount = 0;
        this.save();
    }

    endTest() {
        this.testEndTime = Date.now();
        this.isUnderTest = false;
        this.totalExecutionTime = (this.testEndTime - this.testStartTime) / 1000;
        this.save();
    }

    recordFailure(desc, severity = 1, fixTime = null) {
        if (!this.isUnderTest) return null;

        const t = (Date.now() - this.testStartTime) / 1000;
        const last = this.lastFailureTime ?? t;

        const f = {
            id: this.failures.length + 1,
            time: t,
            interval: t - last,
            desc,
            severity,
            fixTime
        };

        this.failures.push(f);
        this.failureCount++;
        this.lastFailureTime = t;

        if (fixTime) this.fixTimes.push(fixTime);

        this.save();
        return f;
    }

    lambda() {
        if (!this.failures.length) return 0;

        const recent = this.failures.slice(-10);
        let sum = 0;

        for (let i = 1; i < recent.length; i++) {
            sum += recent[i].time - recent[i - 1].time;
        }

        const base = sum || this.totalExecutionTime || 1;
        return recent.length / base;
    }

    mttf() {
        return this.failureCount ? this.totalExecutionTime / this.failureCount : Infinity;
    }

    mttr() {
        return this.fixTimes.length
            ? this.fixTimes.reduce((a, b) => a + b, 0) / this.fixTimes.length
            : 0;
    }

    mtbf() {
        return this.mttf() + this.mttr();
    }

    availability() {
        const mttf = this.mttf();
        const mttr = this.mttr();
        return mttf + mttr ? mttf / (mttf + mttr) : 1;
    }

    reliability(t = 3600) {
        return Math.exp(-this.lambda() * t);
    }

    laplace() {
        if (this.failures.length < 3) return 0;

        const n = this.failures.length;
        const total = this.totalExecutionTime;

        let sum = 0;
        for (const f of this.failures) sum += f.time;

        const num = sum - (n / 2) * total;
        const den = total * Math.sqrt(n / 12);

        return den ? num / den : 0;
    }

    trend() {
        const u = this.laplace();

        if (u < -2) return "GROWING";
        if (u > 2) return "DECREASING";
        return "STABLE";
    }

    setObjective(val) {
        this.failureIntensityObjective = val;
        this.save();
    }

    certify() {
        if (!this.failureIntensityObjective) return "CONTINUE";

        const λ = this.lambda();
        if (λ <= this.failureIntensityObjective) return "ACCEPT";
        if (λ > this.failureIntensityObjective * this.gamma) return "REJECT";
        return "CONTINUE";
    }

    profile(p) {
        let sum = 0;
        for (const k in p) sum += p[k];

        for (const k in p) {
            this.operations[k] = p[k] / sum;
        }
        this.save();
    }

    save() {
        localStorage.setItem("rel", JSON.stringify(this));
    }

    loadFromStorage() {
        const d = JSON.parse(localStorage.getItem("rel") || "null");
        if (d) Object.assign(this, d);
    }

    dashboard() {
        const el = document.getElementById("reliabilityDashboard");
        if (!el) return;

        el.innerHTML = `
            λ: ${this.lambda()}
            MTTF: ${this.mttf()}
            MTBF: ${this.mtbf()}
            A: ${this.availability()}
            R(1h): ${this.reliability()}
            Trend: ${this.trend()}
            Cert: ${this.certify()}
        `;
    }
}

const reliabilityMonitor = new ReliabilityMonitor();

window.recordTriageFailure = (d, i) =>
    reliabilityMonitor.recordFailure(d, i);

window.startReliabilityTest = () =>
    reliabilityMonitor.startTest();

window.endReliabilityTest = () =>
    reliabilityMonitor.endTest();

window.reliabilityMonitor = reliabilityMonitor;
