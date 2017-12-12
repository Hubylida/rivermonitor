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
                cameras.location + '</p>' + '<p class="common-info">时间: ' + cameras.time + '</p>' +
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
            var id = data.length - 1;
            $('#depth-wrap').empty();
            $('#depth-wrap').append(`<p id="depth">${data[id].depth}</>`);

            var echarts = require('echarts');
            var myChart = echarts.init(document.getElementById('chart'));
            function getData() {
                value = data[id].depth;
                now = new Date(+now + oneDay);
                return {
                    name: now.toString(),
                    value: [
                        [now.getFullYear(), now.getMonth(), now.getDate()].join('/'),
                        Math.round(value)
                    ]
                }
            }
            
            var dataAyyay = [];
            var now = new Date();
            var oneDay = 24 * 3600;
            var value = Math.random() * 1000;
            for (var i = 0; i < 1000; i++) {
                dataArray.push(getData());
            }
            
            var option = {
                title: {
                    text: '历史水位'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: true
                    }
                },
                series: [{
                    name: '当前数据',
                    type: 'line',
                    showSymbol: true,
                    hoverAnimation: false,
                    data: dataArray
                }]
            };
            
            setInterval(function () {
            
                for (var i = 0; i < 5; i++) {
                    dataArray.shift();
                    dataArray.push(getData());
                }
                myChart.setOption(option);
                myChart.setOption({
                    series: [{
                        data: dataArray
                    }]
                });
                
            }, 3000);
        }
    });
    }, 3000);
});