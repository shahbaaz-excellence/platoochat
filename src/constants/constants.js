export const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
export const subdomain = JSON.parse(localStorage.getItem("CUSTOMER_DATA"))?.subdomain;
export const displayName = JSON.parse(localStorage.getItem("CUSTOMER_DATA"))?.lname ? JSON.parse(localStorage.getItem("CUSTOMER_DATA")).fname.concat(' '+JSON.parse(localStorage.getItem("CUSTOMER_DATA")).lname) : JSON.parse(localStorage.getItem("CUSTOMER_DATA")).fname;

