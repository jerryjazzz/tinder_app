'use strict';

app.factory('Match', function(FURL, $firebaseArray, $ionicPopup){
  var ref = new Firebase(FURL);

  var Match = {
    allMatchesByUser: function(uid){
      return $firebaseArray(ref.child('matches').child(uid));
    },

    checkMatch: function(uid1, uid2){
      var check = ref.child('likes').child(uid2).child(uid1);

      check.on('value', function(snap){
        if (snap.val() != null) {
          ref.child('matches').child(uid1).child(uid2).set(true); //マッチしたペアをDBに保存
          ref.child('matches').child(uid2).child(uid1).set(true);

          $ionicPopup.alert({
            title: 'Matched',
            template: "マッチングしました!!"
          });
        }
      })
    },
    // 交際オファーを拒否した時の処理
    removeMatch: function(uid1, uid2) {
      ref.child('matches').child(uid1).child(uid2).remove(); // DBからマッチしたペアを消去している
      ref.child('matches').child(uid2).child(uid1).remove();

    }

  };
  return Match;
});
