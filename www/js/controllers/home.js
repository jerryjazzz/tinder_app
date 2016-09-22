'use strict';

//これ何か??=> app.jsを継承してるっぽい？
app.controller('HomeCtrl', function(Auth, $ionicLoading, $ionicModal, $scope, Like, Match, uid) {

  var home = this; // thisとはなんだー
  home.currentIndex = null;
  home.currentCardUid = null;

  var maxAge = null;
  var men = null;
  var women = null;
  var currentUid = uid;

  $scope.show = function(){
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  }

  function init() {
    $scope.show();

    home.profiles = [];
    // parseとは何か
    maxAge = JSON.parse(window.localStorage.getItem('maxAge')) || 25;

    men = JSON.parse(window.localStorage.getItem('men'));
    men = men === null? true : men;

    women = JSON.parse(window.localStorage.getItem('women'));
    women = women === null? true : women;

    // auth.jsのgetProfilesByAgeメソッドを使っている
    Auth.getProfilesByAge(maxAge).$loaded().then(function(data) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        if ((item.gender == 'male' && men) || (item.gender == 'female' && women)) {
          if (item.$id != currentUid)
          home.profiles.push(item);
        }
      }
      // like.jsで定義されている
      Like.allLikesByUser(currentUid).$loaded().then(function(likesList){
        home.profiles = _.filter(home.profiles, function(obj){
          return _.isEmpty(_.where(likesList, {$id: obj.$id}));
        });
      });

      if (home.profiles.length > 0) {
        home.currentIndex = home.profiles.length - 1;
        home.currentCardUid = home.profiles[home.currentIndex].$id;
      }

      $scope.hide();

    });
  };
// 年齢指定範囲のみの対象を表示させる
$scope.$on('$ionicView.enter', function(e) {
  init();
});

home.nope = function(index){
  home.cardRemoved(index); // スワイプしたカードを消す
  console.log('嫌い!');
};

home.like = function(index, like_uid){
  Like.addLike(currentUid, like_uid); //like.js内に処理がある
  Match.checkMatch(currentUid, like_uid);

  home.cardRemoved(index);　// スワイプしたカードを消す
  console.log('好き！！');
};

// スワイプしたcard（相手）を消去していく処理
home.cardRemoved = function(index){
  home.profiles.splice(index, 1);

if (home.profiles.length > 0){
  home.currentIndex = home.profiles.length - 1; //
  home.currentCardUid = home.profiles[home.currentIndex].$id; // 何処理か不明
}
};

$ionicModal.fromTemplateUrl('templates/info.html', {
  scope: $scope
})
.then(function(modal){
  $scope.modal = modal;
});


home.openModal = function(){
  home.info = Auth.getProfile(home.currentCardUid);
  $scope.modal.show();
};
home.closeModal = function(){
  $scope.modal.hide();
};

});
