/**
 * Created by apin on 2018/1/5.
 */
import React, {Component,} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import MyEtcListView from '../../../component/ListView/MyFlatList.js';
import CellCalendar from './cell/CellCalendar.js'
import {PageView} from "myapplib";

class CalendarList extends Component {
    constructor(props) {
        super(props);
        let dayObj = this.props.myValue;

        this.state = {
            showDayArr:["2018-1-1","2018-1-5"]
        };

        this.minDate = "2018-1-1";
        this.maxDate = this.getDateStr(1).value;

        this.weekArr = ["日", "一", "二", "三", "四", "五", "六"];
        this.list = this.getY_M();
    }


    getY_M() {
        let dd = new Date();
        let year = dd.getFullYear();
        let month = dd.getMonth() + 1;//获取当前月份的日期

        let dateArr = [];
        for (let i = 2018; i <= year; i++) {
            if (i < year) {
                for (let j = 1; j <= 12; j++) {
                    dateArr.push(i + "-" + (j < 10 ? ("0" + j) : j));
                }
            } else {
                for (let j = 1; j <= month; j++) {
                    dateArr.push(i + "-" + (j < 10 ? ("0" + j) : j));
                }
            }
        }
        return dateArr
    }

    //获取昨天\今天\明天及以后的时间 -1是昨天 0是今天 1 2 3 4 5
    getDateStr(AddDayCount) {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;//获取当前月份的日期
        let d = dd.getDate();
        return {
            value: y + "-" + m + "-" + d,
            date: dd
        };
    }

    componentDidMount() {

    }

    _renderRowView(rowData, highlightRow) {
        let item = rowData.item;
        return (
            <CellCalendar
                onSelectDate={(showDayArr,isDoubleSel) => {
                    this.setState({
                        showDayArr:showDayArr,
                        isDoubleSel:isDoubleSel
                    });
                }}
                noBeforeClickDate={this.minDate}
                noAfterClickDate={this.maxDate}
                current_Y_M_D={item}
                showDayArr={this.state.showDayArr||[]}
                isDoubleSel = {this.state.isDoubleSel}
            />);
    }

    _onFetch(page = 0, callback, options) {
        callback(this.list.slice(2 * (page - 1), page * 2), {
            allLoaded: page * 2 >= this.list.length, //显示结束的底部样式,由你来控制
        });
    }

    render() {
        var main = (<View style={{flex: 1, backgroundColor: "#ffffff"}}>
            <View style={styles.cBodyHead}>
                {this.createWeekItem()}
            </View>
            <View style={{flex: 1}}>
                <MyEtcListView
                    startLoad={false}
                    style={{}}
                    rowView={this._renderRowView.bind(this)}//每行显示
                    onFetch={this._onFetch.bind(this)}//抓取数据
                    ref={(lv) => {
                        this.listView = lv;
                    }}
                    emptyView={(refreshCallback) => {
                        return (<View/>);
                    }}
                    paginationAllLoadedView={() => {
                        return (<View/>)
                    }}/>
            </View>
        </View>);

        return (<PageView
            ref={(ref) => {
                this.pageView = ref;
            }}
            config={PageView.defaultConfig(this, {})}>
            {main}
        </PageView>)
    }

    createWeekItem() {
        let weekArrView = [];
        let data = this.weekArr;
        for (let i = 0; i < data.length; i++) {
            let dataItem = data[i];
            let div = (<Text style={styles.cBodyItem} key={i + "week"}>{dataItem}</Text>);
            weekArrView.push(div);
        }
        return weekArrView;
    }
}

let styles = StyleSheet.create({
    cBodyHead: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        paddingVertical: 15,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "#dfdfdf"
    },
    cBodyItem: {
        width: "14.2%",
        borderWidth: 0,
        textAlign: "center",
        color: "#282828",
        fontSize: 12
    },
});
module.exports = CalendarList;
