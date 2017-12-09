// import _ from 'lodash';
import './index.css';
import bg_img from '../components/img/bg.jpg';
 
function createBtn (){
  $.ajax({
    url: 'cameras',
    type: 'get',
    success:function(data){
      var cameras = data;
      var btns = '';
      for(var i = 0; i < cameras.length; i++){
        btns += `<a class="btn btn-info cam-btn" href="camera_`+(i+1)+`" role="button">${cameras[i].name}</a>`;
      }
      $('#btn-contain').append(btns);
    }
  })
}
createBtn();