var fs = require('fs')
  , path = require('path');

/*
 * GET assets listing.
 */
exports.list = function(req, res, next){
  var files_dir = './public/uploads/'
    , files = fs.readdirSync(files_dir)
    , file_infos = []

  files.forEach(function(file){
    var file_stat = fs.statSync(files_dir + file)
      , obj = {
        filename: file,
        path: '/uploads/' + file,
        size: file_stat.size,
        updated_at: file_stat.mtime,
        created_at: file_stat.ctime
      }

    file_infos.push(obj)
  })

  // res.send("respond with a resource");
  res.json(file_infos)
};

/*
 * POST file upload.
 */
exports.upload = function(req, res, next){

  var res_obj = {
    success: true,
    message: ''
  };

  var file = req.files.uploadFile;

  if(file){

    if(file.name == '' || file.size == 0){
      res_obj.success = false;
      res_obj.message = '文件为空。';
      res.json(res_obj);
      return;
    }

    var name = file.name
      , filename = +new Date + '_' + file.filename
      , temp_path = file.path
      , file_path = './public/uploads/' + filename;

      fs.rename(temp_path, file_path, function(err){
        if(err) throw err;
        fs.unlink(temp_path, function(){
          res_obj.message = '文件保存成功。';
          res.json(res_obj);
          return;
        });
      });

  }
  else{
    res_obj.success = false;
    res_obj.message = '参数有误。';
    res.json(res_obj);
    return;
  }

}