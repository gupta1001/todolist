//jshint esversion:6

exports.getDate = function(){
    const today = new Date();
    //let currentDay = today.getDay();
    // let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // let day = week[currentDay]
    // switch (currentDay) {
    //     case 0:
    //         day = "Sunday"
    //         break;
    //     case 1:
    //         day = "Monday"
    //         break;
    //     case 2:
    //         day = "Tuesday"
    //         break;
    //     case 3:
    //         day = "Wednesday"
    //         break;
    //     case 4:
    //         day = "Thursday"
    //         break;
    //     case 5:
    //         day = "Friday"
    //         break;
    //     case 6:
    //         day = "Saturday"
    //         break;
    //     default:
    //         console.log("The current day is equal to: " + currentDay);
    //         break;
    // }
    // let day = ""
    // if (currentDay === 0 || currentDay === 6){
    //     day = "weekend!";
    // }
    // else{
    //     day = "weekday!";
    // }
    const options = {
        weekday: 'long',
        day: "numeric",
        month: "long"
    }
    return today.toLocaleDateString("en-US", options);
}

exports.getDay = function(){
    const today = new Date();
    const options = {
        weekday: 'long',
    }
    return today.toLocaleDateString("en-US", options);
}