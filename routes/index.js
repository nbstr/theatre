var express = require('express');
var router = express.Router();

// POST :: add a new user & order
router.post('/order', function(req, res) {

    var db = req.db;
    var user = req.body.user;

    user.group = req.body.group;

    db.collection('users').insert(user, function(error, result){
        var new_user = result[0];
        var order = {
            user:new_user._id,
            orders:req.body.orders
        };
        db.collection('orders').insert(order, function(error, result){
            res.json({
                error:error,
                response:result
            });
        });
    });
});

// GET :: get a list of all events
router.get('/events', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (error, items) {
        res.json(items);
    });
});

/*
// GET :: get one user
router.get('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('userlist').findById(id, function (error, items) {
        res.json(items);
    });
});

// POST :: add a new user
router.post('', function(req, res) {

    var db = req.db;
    var data = $http.filter('user', req.body);

    db.collection('userlist').insert(data, function(error, result){
        res.send(data);
    });
});

// PUT :: edit a user
router.put('/:id', function(req, res) {

    var db = req.db;
    var id = req.params.id;
    var data = $http.filter('user', req.body);

    db.collection('userlist').updateById(id, {$set:data}, function(err, result) {
	    res.send({error:err, result:result});
	});
});

// DELETE :: delete a user by id
router.delete('/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(error, result) {
        res.send((result === 1) ? { msg: 'success', result:result } : { msg:'error: ' + error });
    });
});
*/


module.exports = router;
