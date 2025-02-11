const date = new Date();
let plus = date.getMonth() > 1 ? 0 : 1;
document.getElementById("age").innerText = date.getFullYear() - 2009 - plus;
