let FormatDate = (timestamp) => {
    let myDate = new Date(Number(timestamp))
    var yyyy = myDate.getFullYear();
    var mm = myDate.getMonth() + 1; // getMonth() is zero-based
    var dd = myDate.getDate();
    var hours = myDate.getHours()
    var minute = myDate.getMinutes()
    var seconds= myDate.getSeconds()
    return yyyy+"/"+mm+"/"+dd+" "+hours+":"+minute+":"+seconds
}
export default FormatDate