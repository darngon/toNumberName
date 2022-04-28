// noinspection DuplicatedCode

function toNumberName(number, abbreviate, decimalPlaces, onlyExponent, dontChange, dontChange1) {
    const arrays = [
        ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"],
        ["", "mi", "bi", "tri", "quadri", "quinti", "sexti", "septi", "octi", "noni"],
        ["", "deci", "viginti", "triginti", "quadraginti", "quinquaginti", "sexaginti", "septuaginti", "octoginti", "nonaginti"],
        ["", "centi", "ducenti", "trucenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"],
        ["", "milli-", "micro-", "nano-", "pico-", "femto-", "atto-", "zepto-", "yocto-", "xono-", "veco-"],
        ["", "milli", "micri", "nani", "pici", "femti", "atti", "zepti", "yocti", "xoni", "veci"],
        ["me", "due", "tre", "tetre", "pente", "hexe", "hepte", "octe", "enne"],
        ["ci", "icosi", "triaconti", "tetraconti", "pentaconti", "hexaconti", "heptaconti", "octaconti", "ennaconti"],
        ["hecti", "dohecti", "triahecti", "tetrahecti", "pentahecti", "hexahecti", "heptahecti", "octahecti", "ennahecti"],
        ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
        ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
        ["ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
        ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
        ["", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"],
        ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Ocg", "Nog"],
        ["", "Ct", "Dct", "Tct", "Qagt", "Qigt", "Ssct", "Spgt", "Ocgt", "Nogt"],
        ["", "MI-", "μ-", "N-", "P-", "F-", "A-", "Z-", "Y-", "X-", "V-"],
        ["", "MI", "μ", "N", "P", "F", "A", "Z", "Y", "X", "V"],
        ["m", "d", "tr", "te", "p", "hx", "hp", "oc", "en"],
        ["c", "i", "trc", "tec", "pc", "hxc", "hpc", "occ", "enc"],
        ["h", "dh", "trh", "teh", "ph", "hxh", "hph", "och", "enh"]
    ];

    function toNumberNameMantissa(n) {
        n = Math.floor(n);
        let output2 = "";
        if (abbreviate) return n;
        if (n >= 100) {
            output2 += `${arrays[9][Math.floor(n / 100) - 1]} hundred `;
            n -= Math.floor(n / 100) * 100;
        }
        if (n >= 20) {
            output2 += `${arrays[11][Math.floor(n / 10) - 1]}`;
            n -= Math.floor(n / 10) * 10;
            if (n > 0) output2 += "-";
        }
        if (n >= 11 && n <= 19) {
            output2 += arrays[10][n - 11];
            n = 0;
        }
        if (n === 10) {
            output2 += "ten";
            n = 0;
        }
        if (n > 0) {
            output2 += arrays[9][n - 1];
        }
        return output2;
    }

    if (onlyExponent === undefined) onlyExponent = true;

    if (!onlyExponent && number === "0") return "zero";

    number = number.toString();
    if (number === "Infinity") return "Infinity";
    if (decimalPlaces === undefined) {
        decimalPlaces = 3;
    }
    if (abbreviate) {
        abbreviate = 12;
    } else {
        abbreviate = 0;
    }
    const output = ["", "", "", ""];
    let exponent;
    let mantissa;
    if (number.match("e") !== null) {
        exponent = Number(number.split("e")[1]);
        if (decimalPlaces !== -1) {
            mantissa = (Number(number.split("e")[0]) * 10 ** (exponent % 3)).toFixed(decimalPlaces);
        } else {
            mantissa = Number(number.split("e")[0]) * 10 ** (exponent % 3);
        }
    } else {
        exponent = number.split(".")[0].length - 1;
        if (decimalPlaces !== -1 && onlyExponent) {
            mantissa = (Number(number.slice(0, 21)) / 10 ** (number.split(".")[0].slice(0, 21).length - exponent % 3 - 1)).toFixed(decimalPlaces);
        } else {
            mantissa = Number(number.slice(0, 21)) / 10 ** (number.split(".")[0].slice(0, 21).length - exponent % 3 - 1);
        }
    }
    // todo OMG THIS PART
    output[0] = (exponent >= 3003 ? toNumberName(`1e${~~(exponent / 1000) + 3}`, abbreviate, decimalPlaces, onlyExponent, exponent >= 3003, true) : "") + (exponent % 3000 >= 3 && exponent % 3000 < 6 ? "" : arrays[4 + abbreviate][~~(Math.log10(exponent / 3 - 1) / 3)]);
    if (exponent % 3000 >= 3 && exponent % 3000 < 6) {
        output[1] = arrays[5 + abbreviate][~~(Math.log10(exponent / 3 - 1) / 3)];
    }
    if ((exponent - 3) % 3000 < 33 && !dontChange1) {
        output[2] = arrays[1 + abbreviate][~~((exponent - 3) % 30 / 3)];
        if (exponent >= 3 && exponent < 6) {
            output[2] = abbreviate ? "K" : "thousand";
        }
    } else {
        output[2] = arrays[abbreviate][~~((exponent - 3) % 30 / 3)];
    }
    output[3] = arrays[2 + abbreviate][~~((exponent - 3) % 300 / 30)];
    output[4] = arrays[3 + abbreviate][~~((exponent - 3) % 3000 / 300)];
    let output3 = exponent >= 3 && !onlyExponent ? toNumberName(number % 10 ** (Math.floor(exponent / 3) * 3), abbreviate, decimalPlaces, false) : "";
    if (dontChange) {
        mantissa = "";
    } else {
        mantissa += " ";
    }
    if (!onlyExponent) {
        mantissa = toNumberNameMantissa(mantissa);
    }
    let output2 = `${mantissa} ${output.join("")}${abbreviate || exponent < 6 || dontChange ? "" : "llion"} ${output3}`.replaceAll("undefined", "").replaceAll("  ", " ");
    if (output2[output2.length - 1] === " ") output2 = output2.slice(0, output2.length - 1);
    if (output2 !== "un") {
        return output2.includes("Infinity") ? "Infinity" : output2;
    } else {
        return "";
    }
}