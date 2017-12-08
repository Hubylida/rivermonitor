import './video.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
import '../components/img/nav.png'
import './1.mp4'

$(function () {
    var url = window.location.href,
        camId = url.split('/');
    $('#video-a').css('border-left-color', "#11afff");
    $('#video-a').attr('href', camId[3]);
    $('#photo-a').attr('href', camId[3] + '_p');
    var flag = true;
    $('#nav-btn').on('click', function () {
        if(flag){
            $('#left').animate({
                left: '+=13em'
            }, 500);
        }else{
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
            var echarts = require('echarts');
            var chart = echarts.init(document.getElementById('chart'));
            $('#video').attr('src', data.video_url);

            function randomData() {
                now = new Date(+now + oneDay);
                value = value + Math.random() * 21 - 10;
                return {
                    name: now.toString(),
                    value: [
                        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                        Math.round(value)
                    ]
                }
            }

            var data = [];
            var now = +new Date(1997, 9, 3);
            var oneDay = 24 * 3600 * 1000;
            var value = Math.random() * 1000;
            for (var i = 0; i < 1000; i++) {
                data.push(randomData());
            }

            var option = {
                title: {
                    text: '历史水位',
                    left: 'center'
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
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '模拟数据',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data
                }]
            };
            setInterval(function () {
                for (var i = 0; i < 5; i++) {
                    data.shift();
                    data.push(randomData());
                }

                chart.setOption(option);
            }, 1000);

        }
    });
    // var interval = setInterval(function () {
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
        }
    });
    // },3000);
})