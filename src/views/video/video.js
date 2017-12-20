import './video.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
import '../components/img/nav.png'

$(function () {
    var url = window.location.href,
        camId = url.split('/');
    $('#video-a').css('border-left-color', "#11afff");
    $('#video-a').attr('href', camId[3]);
    $('#photo-a').attr('href', camId[3] + '_p');
    var flag = true;
    $('#nav-btn').on('click', function () {
        if (flag) {
            $('#left').animate({
                left: '+=13em'
            }, 500);
        } else {
            $('#left').animate({
                left: '-=13em'
            }, 500);
        }
        flag = !flag;
    });
    $.ajax({
        url: 'video',
        type: 'get',
        data: {
            id: camId[3].substring(7)
        },
        success: function (data) {
            var cameras = data;
            var info = '<p class="common-info">摄像头名字: ' + cameras.name + '</p>' + '<p class="common-info">地点: ' +
                cameras.location + '</p>' + '<p class="common-info">时间: ' + cameras.time.substring(0,10)+ '</p>' +
                '<p class="common-info">当前水位:</p><p id="depth-wrap"></p>';
            $('#video-info').append(info);
            $('#video').attr('src', data.video_url);
        }
    });
    var dataArray = [];
    setInterval(function () {
    $.ajax({
        url: 'depth',
        type: 'get',
        data: {
            id: camId[3].substring(7)
        },
        success: function (data) {
            console.log(data);
            var id = data.length - 1;
            $('#depth-wrap').empty();
            $('#depth-wrap').append(`<p id="depth">${data[id].depth}</>`);

            var echarts = require('echarts');
            var myChart = echarts.init(document.getElementById('chart'));      
            var dataArray = [],timeArray = [];
            for(let i = id; i > (id-10); i--){
                dataArray.push(data[i].depth);
                timeArray.push((data[i].time).substring(11,19));
            }
            var option = {
                title: {
                    text: data[id].name+'的历史水位',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: timeArray
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} m'
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                visualMap: {
                    show: false,
                    dimension: 0,
                    pieces: [{
                        lt: 100,
                        gt: 0,
                        color: '#4285f4'
                    }]
                },
                series: [
                    {
                        name:'水深',
                        type:'line',
                        smooth: true,
                        data: dataArray
                        // markArea: {
                        //     data: [ [{
                        //         name: '早高峰',
                        //         xAxis: '07:30'
                        //     }, {
                        //         xAxis: '10:00'
                        //     }], [{
                        //         name: '晚高峰',
                        //         xAxis: '17:30'
                        //     }, {
                        //         xAxis: '21:15'
                        //     }] ]
                        // }
                    }
                ]
            };

                myChart.setOption(option);          
        }
    });
    }, 3000);
});