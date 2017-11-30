import './photo.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
require('../components/js/jqpaginator.min.js')
$(function (){
  $('#photo-a').css('border-left-color','#11afff');

//   $('#btns').jqPaginator({
//     totalPages: 30,
//     visiblePages: 8,
//     currentPage: 1,
//     visiblePages: 7,
//     onPageChange: function (num, type) {
//         $('#text').html('当前第' + num + '页');
//     },
//     first: '<li class="first"><a href="">第一页</a></li>',
//     prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
//     next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
//     last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
//     page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>'
// });
    var camera = {
        "name": "仙林1",
        "location": "仙林"
    }
    $('#camera-info').append('<span id="left-title">'+camera.name+'</span><span id="right-title">'+camera.location+'</span>');

    $.ajax({
        url: 'page_1',
        type: 'get',
        data: {
            rows: 3,
            rowsize: 4
        },
        success:function (data){
            $('#btns').jqPaginator({
                totalPages: 30,
                visiblePages: 8,
                currentPage: 1,
                visiblePages: 7,
                onPageChange: function (num, type) {
                    $('#text').html('当前第' + num + '页');
                    $.ajax({
                        url: 'page_' + (num),
                        type: "get",
                        data:{
                            rows: 3,
                            rowsize: 4
                        },
                        success: function (data){
                            console.log("大吉大利，今晚吃鸡！");
                        }
                    })
                },
                first: '<li class="first"><a href="">第一页</a></li>',
                prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
                next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
                last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            })
        }
    })
})