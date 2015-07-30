 function Hour(){
    var wert = string2seconds(arguments[0]);

    // ist der Kontext ein String, dann ist das Objekt ein formatierter String
    this.toString = function() { return '' +seconds2string(wert);};
    
    // ist der Kontext kein String, dann ist das Objekt eine Zahl
    this.valueOf = function() { return wert;};
    
    this.set = function(s) {
        wert = s;
        return this;
    };
    
    // private functions

    function seconds2string(n){
        var n = wert;
        var sign = n < 0 ? '-' : '';
        n = Math.abs(n);
        var h = parseInt(n / 3600);
        var m = parseInt((n / 60 ) % 60);
        var sec = parseInt(n % 60);

        return sign + frmt(h) + ':' + frmt(m);
    }
    
    function string2seconds(n) {
        //alert(n);
        if(!n) return 0;
        var tmp = n.split(':');
        if(!tmp.length) tmp[0] = 0;
        if(tmp.length < 2) tmp[1] = 0;
        if(tmp.length < 3) tmp[2] = 0;
        while(tmp[2] > 59) {
            tmp[2] -= 60;
            ++tmp[1];
        }
        while(tmp[1] > 59) {
            tmp[1] -= 60;
            ++tmp[0];
        }
        return (tmp[0] * 3600 + tmp[1] * 60 + 1 * tmp[2]);
    }

    function frmt(n) { return n < 10 ? '0' + n : n;}
}

Hour.prototype = {
add: function(time) { return new Hour().set(this + time );},
sub: function(time) { return new Hour().set(this - time);},
hour: function() {
    var tmp = this.toString().split(':');
    return tmp[0] * 1 + tmp[1] / 60 + tmp[2] / 3600;
}
};

String.prototype.hour = function() { return new Hour(this);}