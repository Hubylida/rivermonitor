import './photo.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
import '../components/img/nav.png'
import b_1 from '../components/img/b-1.png'
require('../components/js/jqpaginator.min.js')
$(function () {
    var url = window.location.href,
        camId = url.split('/');
    $('#photo-a').css('border-left-color', '#11afff');
    $('#video-a').attr('href', camId[3].substring(0, 8));
    var flag = true;
    $('#nav-btn').on('click', function () {
        if (flag) {
            $('#left').animate({
                left: '+=14em'
            }, 500);
        } else {
            $('#left').animate({
                left: '-=14em'
            }, 500);
        }
        flag = !flag;
    });
    var camera = {
        "name": "仙林1",
        "location": "仙林"
    }
    $('#camera-info').append('<span id="left-title">' + camera.name + '</span><span id="right-title">' + camera.location + '</span>');
    $.ajax({
        url: 'page_1',
        type: 'get',
        data: {
            id: camId[3].substring(7, 8),
            rows: 3,
            rowsize: 4
        },
        success: function (data) {
            var totalpicture = data.length;
            var pages = Math.ceil(totalpicture / 12);
            $('#btns').jqPaginator({
                totalPages: pages,
                visiblePages: 8,
                currentPage: 1,
                onPageChange: function (num, type) {
                    $('#text').html('当前第' + num + '页');
                    $.ajax({
                        url: 'page_' + (num + 1),
                        type: "get",
                        data: {
                            id: camId[3].substring(7, 8),
                            rows: 3,
                            rowsize: 4
                        },
                        success: function (pdata) {
                            let recievdData = [...pdata];
                            var elements = '<div class="row">';
                            var row;
                            var index = 0;
                            row = recievdData / 4 < 3 ? recievdData : 3;
                            recievdData.map(function (item, index, array) {
                                if ((index + 1) % 4 == 0) {
                                    elements += '</div>'
                                    elements += '<div class="row">'
                                }
                                elements += '<div class="col-md-3 col-xs-6 photo-item"><img class="photo" src="' + item.photo_src + '"></div>';
                            })
                            $('#main').empty();
                            $('#main').append(elements);
                        }
                    });
                },
                first: '<li class="first"><a href="">第一页</a></li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
                last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            });
        }
    })
})