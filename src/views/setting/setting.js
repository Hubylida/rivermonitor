import './setting.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
// import '../../lib/data.mysql'

$(function () {
  $('#setting-a').css('border-left-color', '#11afff');
  var cameras = [{
      "name": "仙林1",
      "info": "南邮101",
      "mac_address": "8c:85:90:00:42:d0",
      "video_url": "http:www.video.com"
    },
    {
      "name": "仙林1",
      "info": "南邮101",
      "mac_address": "8c:85:90:00:42:d0",
      "video_url": "http:www.video.com"
    },
    {
      "name": "仙林1",
      "info": "南邮101",
      "mac_address": "8c:85:90:00:42:d0",
      "video_url": "http:www.video.com"
    },
    {
      "name": "仙林1",
      "info": "南邮101",
      "mac_address": "8c:85:90:00:42:d0",
      "video_url": "http:www.video.com"
    }
  ]

  function createCameraItems(total) {
    var contain = $('#left-main'),
      rows = Math.ceil(total / 4),
      elements = '',
      index = 0;
    for (let i = 0; i < rows; i++) {
      elements += '<div class="row">'
      for (let j = 0; j < 4; j++) {
        elements += '<div class="col-md-3"><form id="cameras_'+index+'" class="setting-item"><input name=id value="cameras_'+index+++'"><input type="text" name="name" value="' + cameras[j].name + '"><p><span>厂家型号: </span><input type="text" name="info" value="' + cameras[j].info + '"></p><p><span>物理地址: </span><input type="text" name="mac_address" value="' + cameras[j].mac_address + '"></p><p><span>视频链接地址: </span><input type="text" name="video_url" value="' + cameras[j].video_url + '"></p><p class="change btn btn-primary btn-sm">修改</p><p class="save btn btn-primary btn-sm">保存</p></form></div>'
      }
      elements += '</div>'
    }
    $('#left-main').append(elements);
    var item = Item();
    item.disable();
    for(let i = 0; i < total*4; i++){
      $($('.save')[i]).on('click',function (){
        // console.log($(this).parents());
        $(this).parent().submit();
      });
      $($('.change')[i]).on('click',function(){
        var input = $(this).parent().find('input[type="text"]');
        console.log(input);
        item.change(input);
        $(this).addClass('disabled');
      });
    }
    // var l = $('.save').length;
    // for(let i = 0; i < l; i++){
    //   $($('.save')[i]).on('click',function(){
    //     console.log(1);
    //   })
    // }
  }

  createCameraItems(12);

  function Item() {
    var textArray = $('#left-main').find('input');
    var item = {};
    item.textArray = textArray;
    item.disable = function () {
      for (let i = 0; i < this.textArray.length; i++) {
        $(this.textArray[i]).attr('readonly','readonly');
      }
    };
    item.undisabled = function (e) {
      for (let i = 0; i < e.length; i++) {
        console.log(1)
      }
    }
    item.change = function (e) {
      e.removeAttr('readonly');
    }
    return item;
  }
})