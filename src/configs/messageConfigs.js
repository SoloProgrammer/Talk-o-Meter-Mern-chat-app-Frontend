import { getFormmatedDate, getFormmatedTime, Fullmonth, weekDays } from '../configs/dateConfigs'


export const getMsgTime = (timestamps) => {

    let date = new Date(timestamps);
    return getFormmatedTime(date)
}

export const getMessageDay = (msgTimestamps) => {
    const msgFulldate = new Date(msgTimestamps);

    let msgdate = msgFulldate.getDate()
    let currFulldate = new Date()

    if (msgFulldate.getFullYear() !== currFulldate.getFullYear() || msgFulldate.getMonth() !== currFulldate.getMonth()) {
        return getFormmatedDate(msgFulldate);
    }
    else {

        let currdate = currFulldate.getDate()

        let dayDiff = currdate - msgdate;

        if (dayDiff === 0) return "Today"
        else if (dayDiff === 1) return "Yesterday"
        else if(dayDiff < 7) return weekDays[msgFulldate.getDay()]
        else return msgdate + " " + Fullmonth[msgFulldate.getMonth()];
    }

}

export const isFirstMsgOfTheDay = (msgTimestamp, messages, i) => {

    let msgDay = (new Date(msgTimestamp)).getDay()

    if (messages[i - 1]) {

        let preMsgDay = (new Date(messages[i - 1].createdAt)).getDay()

        if (messages[i + 1]) {

            let nextMsgDay = (new Date(messages[i + 1].createdAt)).getDay()

            // console.log(preMsgDate,nextMsgDate);

            if (msgDay !== preMsgDay && msgDay === nextMsgDay) {

                // console.log(messages[i+1],messages[i-1]);
                return true
            }
            else if (msgDay !== preMsgDay && msgDay !== nextMsgDay) return true

        } else {
            if (msgDay !== preMsgDay) return true
        }

    }
    else return true
}

export const isLastMsgOfTheDay = (msgTimestamp, messages, i) => {

    let msgFulldate = new Date(msgTimestamp)
    let msgdate = msgFulldate.getDate()
    if (messages[i + 1]) {
        let nextMsgFulldate = new Date(messages[i + 1].createdAt)
        let nextMsgdate = nextMsgFulldate.getDate()
        if (msgdate !== nextMsgdate) return true
    }

}