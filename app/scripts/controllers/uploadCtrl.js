angular.module('finalProjectApp')
.controller('imgUploadCtrl', ['$scope', '$log',
	function imgUploadCtrl($scope, $log) {
		$scope.upload_image = function (image) {
			if (!image.valid) return;
 
			var imagesRef, safename, imageUpload;
			
			image.isUploading = true;
			imageUpload = {
				isUploading: true,
				data: image.data,
				thumbnail: image.thumbnail,
				name: image.filename,
				author: {
					provider: $scope.auth.user.provider,
					id: $scope.auth.user.id
				}
			};
 
			safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");
			imagesRef = new Firebase($scope.FBURL + '/images');
 
			imagesRef.child(safename).set(imageUpload, function (err) {
				if (!err) {
					imagesRef.child(safename).child('isUploading').remove();
					$scope.$apply(function () {
						$scope.status = 'Your image "' + image.filename + '" has been successfully uploaded!';
						if ($scope.uploaded_callback !== undefined) {
							$scope.uploaded_callback(angular.copy(imageUpload));
						}
						image.isUploading = false;
						image.data = undefined;
						image.filename = undefined;
					});
				}else{
					$scope.error = 'There was an error while uploading your image: ' + err;
				}
			});
		};
	}
]);