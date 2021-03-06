"use strict";
var model=
{
	getPosition: function(callback){
		this.userPos = {};
		var self=this;

		navigator.geolocation.getCurrentPosition(
			function(pos){
				self.userPos.lat = pos.coords.latitude;
				self.userPos.lng = pos.coords.longitude;
				callback.call(this, self.userPos);
				
				//self obligatoire, mais ne sera pas renvoyé. Sera renvoyé ici userpos
			},
			function(){
				// dans le cas où je refuse
				console.log('refusé');
				self.userPos.lat = 48.857713;
				self.userPos.lng = 2.347271;
				callback.call(this, self.userPos);
			},
			{enableHighAccuracy:true}
		);
	},

	getGpsBar: function(i,adressbar, userPos, callback){
		var barPos = new google.maps.Geocoder();
		var self=this;
		this.barPosResult = {};
		var adress={}

		barPos.geocode( { 'address': adressbar}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
			    self.barPosResult.lat = results[0].geometry.location.k;
				self.barPosResult.lng = results[0].geometry.location.B;
				callback.call(this,i, userPos, self.barPosResult);
		    } 
		    else {
		    	alert('Geocode was not successful for the following reason: ' + status);
		    	// callback.call(this, userPos, self.barPos);
		    }

		});
	},

	calculBar: function(i,userPos, barPos, callback){
		var radius = 6378.137,
        d_lat  = (barPos.lat - userPos.lat) * Math.PI / 180,
        d_lon  = (barPos.lng - userPos.lng) * Math.PI / 180,
        a      = Math.sin(d_lat/2) * Math.sin(d_lat/2) +
                 Math.cos(userPos.lat * Math.PI / 180) * Math.cos(barPos.lat * Math.PI / 180) *
                 Math.sin(d_lon/2) * Math.sin(d_lon/2),
        c      = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)),
        d      = radius * c;

		d * 1000; //Meters

		model.baradress[i].distbar = d;
		//L'ajoute dans le tableau des bars
		callback.call(this,i);
	},

	triBar: function(callback){
		var temp
		for (var i = model.baradress.length - 1; i >= 0; i--) {

			for (var j = model.baradress.length - 1; j >= 0; j--) {
				if(model.baradress[i].distbar>=model.baradress[j].distbar)
				{
					temp = model.baradress[i];
					model.baradress[i] = model.baradress[j];
					model.baradress[j] = temp;
				}
			};

		};
		callback.call(this);
	},

	slideBox: function(i,callback){
		var slideclose = document.getElementsByClassName("btnderoul");
		for (var j = slideclose.length - 1; j >= 0; j--) {
			if (j==i)
			{
				document.querySelector(".slidernbslide_"+j).classList.toggle("slideropen");
			}
			else
			{
				document.querySelector(".slidernbslide_"+j).classList.remove("slideropen");
			}
			
		};
		callback.call(this);
	},

	baradress : [
    {
    "nom":"Comptoir Général", 
    "adresse":"80 quai de Jemmapes 75010 Paris"
	}, 
	{
    "nom":"Le Biloba", 
    "adresse":"12 rue Jean Jacques Rousseau 75010 Paris"
	}, 
	{
    "nom":"Ecolo Café", 
    "adresse":"257 rue St Denis 75002 Paris"
	}, 
	{
    "nom":"Perto Cacao", 
    "adresse":"2 rue Théophile Roussel 75012 Paris"
	}, 
	{
    "nom":"Starbuck Saint-Michel", 
    "adresse":"24 boulevard Saint-Michel 75006 Paris"
	},
	{
    "nom":"Starbuck Montparnasse", 
    "adresse":"70 boulevard du Montparnasse 75014 Paris"
	},
	{
    "nom":"Starbuck Saint-Dominique", 
    "adresse":"90 rue Saint-Dominique 75007 Paris"
	},
	{
    "nom":"Costa coffee - Rambuteau", 
    "adresse":"38 rue Rambuteau 75003 Paris"
	},
	{
    "nom":"Costa coffee - Rochechouard", 
    "adresse":"82 Boulevard Rochechouart 75018 Paris"
	},
	{
    "nom":"HETIC", 
    "adresse":"27 Bis Rue du Progrès 93100 Montreuil"
	}
	]
}