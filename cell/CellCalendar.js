/**
 * Created by apin on 2017/10/11.
 */
/**
 *  当以下参数都不传的时候显示当前年月日
 *  onSelectDate 回调函数 返回 年 月 日
 *  current_Y_M_D 传入的当前年月日 eg:2018-1-1
 *  showDay 传入的指定要显示的年月日 eg:2018-1-1
 */
import React, {Component,} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import CalendarHelp from './CalendarHelp';

const screenWith = Dimensions.get('window').width;

class CellCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select_year: CalendarHelp.getFullYear(),
            select_month: CalendarHelp.getMonth(),
            days_of_month: [],
            current_Y_M_D: "",
            showDayArr: props.showDayArr || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showDayArr: nextProps.showDayArr || [],
            isDoubleSel: nextProps.isDoubleSel || false
        })
    }

    /**
     * 组件渲染完后执行
     */
    componentDidMount() {
        let {current_Y_M_D, noBeforeClickDate, noAfterClickDate} = this.props;

        let time_start = this.formatDate(noBeforeClickDate).getTime();
        let time_end = this.formatDate(noAfterClickDate).getTime();

        //日历视图
        //开始时间戳"2018-01-01"  终止时间戳是今天
        this.noBeforeTimestamp = noBeforeClickDate ? time_start : "";
        this.noAfterTimestamp = noAfterClickDate ? time_end : "";

        this.initYMD(current_Y_M_D);
    }

    // 初始化状态
    initYMD(current_Y_M_D) {
        let YMD_Arr = current_Y_M_D.split("-");
        let year = YMD_Arr[0] ? YMD_Arr[0] : "";
        let month = YMD_Arr[1] ? YMD_Arr[1] : "";
        let day = YMD_Arr[2] ? YMD_Arr[2] : 0;
        if (year && month) {
            year = parseInt(year);
            month = parseInt(month);
            day = day ? parseInt(day) : 0;
            let days_of_month = CalendarHelp.getDays(year, month);
            let first_day = CalendarHelp.weekOfMonth(new Date(year, month - 1));

            let date = new Date(year, (month - 1), days_of_month);
            let last_day = date.getDay();

            this.setState({
                select_year: year,
                select_month: month - 1,
                days_of_month: days_of_month,
                first_day: first_day,
                last_day: last_day,
            });
        }
    }

    /**
     * 日期选择
     * @param s_day
     */
    selectDate(s_day) {
        let {select_year, select_month, showDayArr, isDoubleSel} = this.state;
        let selectYMD = select_year + "-" + (select_month + 1) + "-" + s_day;
        let dayArr = [];
        if (!isDoubleSel) {
            dayArr = [selectYMD]
        } else {
            dayArr = (new Date(selectYMD).getTime() > new Date(showDayArr[0]).getTime()) ? [showDayArr[0], selectYMD] : [selectYMD, showDayArr[0]];
        }
        this.setState({
            showDayArr: dayArr,
            isDoubleSel: !isDoubleSel
        }, () => {
            this.props.onSelectDate && this.props.onSelectDate(dayArr, !isDoubleSel);
        });
    }

    /**
     * 渲染页面
     */
    render() {
        let {select_year, select_month, days_of_month, first_day, last_day, showDayArr} = this.state;

        let previous_month_days = days_of_month,
            previous_days = [],
            current_days = [],
            next_days = [],
            total_days = [];

        //在本月之前的
        for (let i = 0; i < first_day; i++) {
            let itemView =
                (<View key={'previousItem' + i} style={[styles.itemActive, {backgroundColor: "#f8f9f8",}]}>
                    {/*<Text style={[styles.dayTitle, {color: "#FFF9C4"}]}>*/}
                    {/*{previous_month_days - (first_day - i) + 1}*/}
                    {/*</Text>*/}
                </View>);
            previous_days.push(itemView);
        }

        //在本月当中的
        let currentText = '';
        let itemView = null;
        for (let i = 0; i < days_of_month; i++) {
            //每一天的时间戳
            var everyDate = select_year + "-" + (select_month + 1) + "-" + (i + 1);
            var everyDateStamp = this.formatDate(everyDate).getTime();

            // 今天样式
            currentText = new Date(CalendarHelp.getCurrentDay()).getTime() === everyDateStamp ? '今天' : (i + 1);
            itemView = (<View key={'currentItem' + i} style={styles.itemActive}>
                <Text numberOfLines={1} style={styles.dayTitle}>{currentText}</Text>
            </View>);

            var isBeforeBool = everyDateStamp >= this.noBeforeTimestamp;
            var isAfterBool = (everyDateStamp < this.noAfterTimestamp) || !this.noAfterTimestamp;
            if (isBeforeBool && isAfterBool) {
                // 判断选择样式与历史样式是否相等，相等激活
                var isSelect = (showDayArr.length == 1 && (everyDateStamp == (showDayArr[0] && new Date(showDayArr[0]).getTime())))
                    || ((everyDateStamp >= (showDayArr[0] && new Date(showDayArr[0]).getTime())) && (everyDateStamp <= (showDayArr[1] && new Date(showDayArr[1]).getTime())));
                itemView = (<TouchableOpacity
                    style={[styles.itemActive, {backgroundColor: isSelect ? "#F03928" : "#ffffff",}]}
                    key={'currentItemTag' + i}
                    onPress={() => {
                        this.selectDate(i + 1);
                    }}>
                    <Text style={[styles.dayTitle, {color: isSelect ? "#FFF9C4" : "#333"}]}>
                        {currentText}
                    </Text>
                </TouchableOpacity>);
            }
            current_days.push(itemView);
        }

        //紧随本月之后的
        let last = 7 - (last_day + 1);
        for (let i = 0; i < last; i++) {
            let itemView = (
                <View key={"after" + i} style={[styles.itemActive, {backgroundColor: "#f8f9f8",}]}>
                    {/*<Text style={[styles.dayTitle,{color:"#FFF9C4"}]}>{i + 1}</Text>*/}
                </View>);
            next_days.push(itemView);
        }

        total_days = previous_days.concat(current_days, next_days);
        let row_number = total_days.length / 7;
        let ul_list = [];
        if (total_days.length > 0) {
            for (let i = 0; i < row_number; i++) {
                let li_list = [],
                    start_index = i * 7,
                    end_index = (i + 1) * 7;
                for (let j = start_index; j < end_index; j++) {
                    li_list.push(total_days[j]);
                }
                ul_list.push(li_list);
            }
        }

        return (
            <View style={styles.calendar}>
                <View style={styles.xunCell}>
                    <Text style={{
                        flex: 1,
                        color: "#333",
                        fontSize: 16,
                        textAlign: "center"
                    }}>{select_year + "年" + (select_month + 1) + "月"}</Text>
                </View>
                <View style={{flex: 1, backgroundColor: "#ffffff"}}>
                    {
                        ul_list.map((u, index) => {
                            return (<View key={'ul' + index} style={{flex: 1, flexDirection: "row"}}>{u}</View>);
                        })
                    }
                </View>
            </View>
        );
    }

    formatDate(str) {
        let arr = str.split("-");
        return new Date(arr[0], arr[1] - 1, arr[2]);
    }
	
	/**
	     * 获取时间
	     * @param timestamp
	     */
	    getYMDHMS(timestamp = null, format: string = "YYYY-MM-DD") {
	        let time = timestamp ? new Date(timestamp) : new Date();
	        let year = time.getFullYear();
	        let month = time.getMonth() + 1;
	        let date = time.getDate();
	        let hours = time.getHours();
	        let minute = time.getMinutes();
	        let second = time.getSeconds();
	
	        if (month < 10) {
	            month = '0' + month
	        }
	        if (date < 10) {
	            date = '0' + date
	        }
	        if (hours < 10) {
	            hours = '0' + hours
	        }
	        if (minute < 10) {
	            minute = '0' + minute
	        }
	        if (second < 10) {
	            second = '0' + second
	        }
	        let day = null;
	        switch (format) {
	            case "YYYY-MM":
	                day = year + '-' + month;
	                break;
	            case "MM-DD":
	                day = month + '-' + date;
	                break;
	            case "YYYY-MM-DD":
	                day = year + '-' + month + '-' + date;
	                break;
	            case "YYYY-MM-DD hh":
	                day = year + '-' + month + '-' + date + ' ' + hours;
	                break;
	            case "YYYY-MM-DD hh:mm":
	                day = year + '-' + month + '-' + date + ' ' + hours + ':' + minute;
	                break;
	            case "YYYY-MM-DD hh:mm:ss":
	                day = year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second;
	                break;
	            default:
	                break;
	        }
	        return day
	    }
}
module.exports = CellCalendar;


const height_item = (screenWith / 7) * 1.15;
let styles = StyleSheet.create({
    calendar: {
        flex: 1,
        borderColor: "#dfdfdf"
    },
    xunCell: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#eeeeee",
        alignItems: "center",
        justifyContent: "center",
    },
    itemActive: {
        flex: 1,
        height: height_item,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },
    dayTitle: {
        color: "#bbbbbb",
        textAlign: "center",
        fontSize: 16
    },
});