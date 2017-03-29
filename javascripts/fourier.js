function Fourier( _len_points ){
    this.m_aX = [];
    this.m_bX = [];
    this.m_aY = [];
    this.m_bY = [];
    this.len_points = _len_points;
}

/**
 * convert array of points to Fourier series
 */
Fourier.prototype.expandFourierSeries = function( _arrayPt, _iMaxDegree ){
    var _iNumOfUnit = _arrayPt.length;

    this.m_aX = new Array(_iMaxDegree+1);
    this.m_bX = new Array(_iMaxDegree+1);
    this.m_aY = new Array(_iMaxDegree+1);
    this.m_bY = new Array(_iMaxDegree+1);

    for ( var k=0; k<= Math.min(_iMaxDegree, _iNumOfUnit/2); k++) {
        this.m_aX[k] = 0.0;
        this.m_bX[k] = 0.0;
        this.m_aY[k] = 0.0;
        this.m_bY[k] = 0.0;

        for ( var n=0; n<_iNumOfUnit; n++) {
            var t = 2 * Math.PI * n / _iNumOfUnit - Math.PI;
            this.m_aX[k] += _arrayPt[n].x * Math.cos( k * t );
            this.m_bX[k] += _arrayPt[n].x * Math.sin( k * t );

            this.m_aY[k] += _arrayPt[n].y * Math.cos( k * t );
            this.m_bY[k] += _arrayPt[n].y * Math.sin( k * t );
        }

        this.m_aX[k] *= 2/_iNumOfUnit;
        this.m_bX[k] *= 2/_iNumOfUnit;
        this.m_aY[k] *= 2/_iNumOfUnit;
        this.m_bY[k] *= 2/_iNumOfUnit;
    }

}

/**
 * restore array of points from Frouier series
 */
Fourier.prototype.restorePoints = function(){
    var _listPt = [];
    var k_MAX = this.m_aX.length-1;
    
    for( var pi = 0 ; pi < this.len_points ; pi ++ ){
        var p_restored = new Point(0, 0);
        var t = 2 * Math.PI * pi/this.len_points - Math.PI;

        p_restored.x += this.m_aX[0]/2;
        p_restored.y += this.m_aY[0]/2;
        for(let k = 1 ; k <= k_MAX ; k ++ ){
            p_restored.x += this.m_aX[k] * Math.cos(k*t);
            p_restored.x += this.m_bX[k] * Math.sin(k*t);
            p_restored.y += this.m_aY[k] * Math.cos(k*t);
            p_restored.y += this.m_bY[k] * Math.sin(k*t);
        }
        _listPt.push(p_restored);
    }
    
    return _listPt;
}