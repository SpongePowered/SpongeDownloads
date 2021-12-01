const VersionSort = (function() {

    // Group 1 is major
    // Group 2 is minor
    // Group 4 is patch
    // Group 6 is pre/rc
    // Group 7 is pre number
    const SEM_VER_REGEX = /^(\d+)\.(\d+)(\.(\d+))?(-(pre|rc)(\d+))?$/i;

    const intOrZero = function(val) {
        if (!val) {
            return 0;
        }
        return parseInt(val);
    }

    const valueFromPreString = function(val) {
        if (val?.toLowerCase() === "pre") {
            return -2;
        } else if (val?.toLowerCase() === "rc") {
            return -1;
        }
        return 0;
    }

    // [major, minor, patch, pre|rc, version] -- pre = -2, rc = -1

    const getVersionValues = function(inputString) {
        const regexResult = SEM_VER_REGEX.exec(inputString);
        if (!regexResult) {
            return [0, 0, 0, 0, 0];
        }

        return [intOrZero(regexResult[1]), intOrZero(regexResult[2]), intOrZero(regexResult[4]), valueFromPreString(regexResult[6]), intOrZero(regexResult[7])]
    }

    const sortFunc = function(first, second) {
        const firstVals = getVersionValues(first);
        const secondVals = getVersionValues(second);
        for (let i = 0; i < firstVals.length; ++i) {
            if (firstVals[i] !== secondVals[i]) {
                return secondVals[i] - firstVals[i]; // we want reverse order
            }
        }
        return 0;
    }

    return {
        sortVersions: (versionArray) => versionArray.sort(sortFunc)
    }
})();

export default VersionSort;