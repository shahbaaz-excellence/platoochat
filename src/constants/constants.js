export const customerData = JSON.parse(localStorage.getItem("CUSTOMER_DATA"));
export const subdomain = JSON.parse(localStorage.getItem("CUSTOMER_DATA"))?.subdomain;
export const displayName = JSON.parse(localStorage.getItem("CUSTOMER_DATA"))?.lname ? JSON.parse(localStorage.getItem("CUSTOMER_DATA")).fname.concat(' '+JSON.parse(localStorage.getItem("CUSTOMER_DATA")).lname) : JSON.parse(localStorage.getItem("CUSTOMER_DATA")).fname;
export const auditorium_id = JSON.parse(localStorage.getItem("auditorium_id"));
export const exhibition_id = JSON.parse(localStorage.getItem("exhibition_id"));

