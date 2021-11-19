export default function convertToJavaString(jsonString, config) {
    console.log("Input: " + jsonString);
    jsonString = jsonString.replace(/\d\.\d\d*\s*,/, "1.1,");
    console.log("After Regex: " + jsonString);
    const obj = JSON.parse(jsonString);
    const keys = Object.keys(obj);

    let result = "";
    keys.forEach(element => {
        result += toJavaField(element, obj[element], config) + "\n";
    });

    return result;
}

function toJavaField(name, value, config) {
    return `    @JsonProperty("${name}")\n    private ${getJavaClass(value)} ${toJavaNaming(name, config)};\n`;
}

function getJavaClass(jsObject) {
    const jsType = typeof (jsObject);

    if (jsType === "string") return "String";
    if (jsType === "boolean") return "Boolean";
    if (jsType === "number") {
        if (Number.isInteger(jsObject)) return "Integer";
        return "Float";
    }
    if (jsType === "object" && Array.isArray(jsObject)) {
        if (jsObject.lenth === 0) return "List<Object>";
        return `List<${getJavaClass(jsObject[0])}>`;
    }
    return "Object";
}

function toJavaNaming(string, config) {
    const lower = string.charAt(0).toLowerCase() + string.slice(1);

    if(config.snakeToCamel) return lower.replaceAll(/_(\w)/g, (match) => { return match.slice(1).toUpperCase(); });

    return lower;
}