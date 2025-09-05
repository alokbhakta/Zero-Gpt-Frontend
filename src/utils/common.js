function str_obj(str) {
str = str.split('; ');
const result = {};
for (let i in str) {
    const cur = str[i].split('=');
    result[cur[0]] = cur[1];
}
return result;
}


export {str_obj}