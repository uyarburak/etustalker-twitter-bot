console.log('Starting...');

var Twit = require('twit');
var account = require('account');

var T = new Twit(account);

var CronJob = require('cron').CronJob;

var mysql = require('mysql');

new CronJob('0 30 6 * * *', function() { // everyday at 6.30 am
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'password_comes_here',
	  database : 'db_name_comes_here'
	});
	connection.connect();
	connection.query("select a.cogul_hit, b.new_users, c.total_user from (SELECT count(1) as cogul_hit FROM LOGS where time >= NOW() - INTERVAL 1 DAY and type = 'VERSION_CHECK') a,(SELECT count(1) as new_users from (SELECT min(time) FROM LOGS GROUP BY device_id having min(time) >= NOW() - INTERVAL 1 DAY) as t) b,(SELECT count(1) as total_user from (SELECT device_id FROM LOGS GROUP BY device_id) as t) c", function(err, rows, fields) {
		var cogul_hit = 0;
		var new_users = 0;
		var total_user = 0;
		if (!err){
		  cogul_hit = rows[0]['cogul_hit'];
		  new_users = rows[0]['new_users'];
		  total_user = rows[0]['total_user'];
		  
		  var zaa = "[BOT]\nToplam kullanici sayisi: "+total_user+"\nDunku kullanim sayisi: "+cogul_hit+"\nDunku yeni kullanicilarin sayisi: "+new_users;
		  if(total_user > 0){
			  T.post('statuses/update', { status: zaa }, function(err, data, response) {
				  if (err) {
					console.log("Something went wrong!")
				  }else{
					console.log("Tweeted!")
				  }
			  });
		  }
		}
		else
		console.log('Error while performing Query.');

	});
	connection.end();
}, null, true);