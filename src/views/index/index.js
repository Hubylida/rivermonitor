// import _ from 'lodash';
import './index.css';
import bg_img from './bg.jpg';
 
function createBtn (){
  var cameras = ['仙林1','仙林2','仙林3','仙林4','仙林5','仙林6','仙林7','仙林8','仙林9','仙林10'];
  var nums = 10;
  var btns = '';
  for(var i = 0; i < nums; i++){
    btns += '<a class="btn btn-info cam-btn" href="video_1" role="button">' + cameras[i] + '</a>';
  }
  $('#btn-contain').append(btns);
}
createBtn();