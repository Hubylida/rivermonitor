import './setting.css'
import '../components/img/name.jpg'
import '../components/img/home_icon.png'
import '../components/img/video_icon.png'
import '../components/img/photo_icon.png'
import '../components/img/setting_icon.png'
// import '../../lib/data.mysql'
$(function () {
  $('#setting-a').css('border-left-color', '#11afff');
  var flag = true;
  $('#nav-btn').on('click', function () {
      if(flag){
          $('#left').animate({
              left: '+=14em'
          }, 500);
      }else{
          $('#left').animate({
              left: '-=14em'
          }, 500);
      }           
      flag = !flag;
  });
  $.ajax({
    url: 'setting',
    type: 'get',
    success: function (data) {
      var cameras = data;

      function createCameraItems(total) {
        var contain = $('#right-main'),
          rows = Math.ceil(total / 4),
          elements = '',
          index = 0;
        for (let i = 0; i < rows; i++) {
          elements += '<div class="row">'
          for (let j = 0; j < 4; j++) {
            if (index < total) {
              elements += '<div class="col-md-3"><div class="setting-item"><input name=id value="' + (index + 1) + '"><input type="text" name="name" value="' + cameras[index].name + '"><p><span>厂家型号: </span><input type="text" name="info" value="' + cameras[index].info + '"></p><p><span>物理地址: </span><input type="text" name="mac" value="' + cameras[index].mac + '"></p><p><span>视频链接地址: </span><input type="text" name="video_url" value="' + cameras[index].video_url + '"></p><button class="change btn btn-primary btn-sm">修改</button><button id="save" class="save btn btn-primary btn-sm">保存</button></div></div>'
              index = index + 1;
            } else {
              break;
            }
          }
          elements += '</div>'
        }
        $('#right-main').append(elements);
        var item = Item();
        item.disable();
        for (let i = 0; i < total; i++) {
          $($('.save')[i]).on('click', function () {
            $($(this).parent().find('button')[0]).removeClass('disabled');
            item.disable();
            $.ajax({
              url: 'camera_info',
              type: 'post',
              data: {
                camera_id: $(this).parent().find('input')[0].value,
                name: $(this).parent().find('input')[1].value,
                info: $(this).parent().find('input')[2].value,
                mac: $(this).parent().find('input')[3].value,
                video_url: $(this).parent().find('input')[4].value
              },
              success: function (data) {
                console.log(data);
              }
            });
          });
          $($('.change')[i]).on('click', function () {
            var input = $(this).parent().find('input[type="text"]');
            item.change(input);
            $(this).addClass('disabled');
          });
        }
      }
      createCameraItems(cameras.length);

      function Item() {
        var textArray = $('#right-main').find('input');
        var item = {};
        item.textArray = textArray;
        item.disable = function () {
          for (let i = 0; i < this.textArray.length; i++) {
            $(this.textArray[i]).attr('readonly', 'readonly');
          }
        };
        item.change = function (e) {
          e.removeAttr('readonly');
        };
        return item;
      }
    }
  });
})