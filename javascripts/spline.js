function Spline() {
    this.g_fThresholdToRemove = 2;
}

Spline.prototype.getSpline = function(_applet, _arrayPt, _multiple) {
    var _arrayT = new Array(_arrayPt.length);
    for (var i = 0; i < _arrayPt.length; i++) {
        _arrayT[i] = i * 2 * Math.PI / (_arrayPt.length - 1) - Math.PI;
    }
    var _points = this.getSplineSeries(_applet, _arrayT, _arrayPt, _multiple);
    var _retPoints = new Array(_points.length * 2 - 1);
    for (var i = 0; i < _points.length; i++) {
        _retPoints[i] = _points[i];
        _retPoints[_retPoints.length - i - 1] = _points[i];
    }
    
    return _retPoints;
}


Spline.prototype.GetInterXYSeries = function(_t, _arrayPt, _multiple) {
    var _retPoints = new Array(_arrayPt.length * _multiple);
    _retPoints[0] = new Point(_arrayPt[0].x, _arrayPt[0].y);
    _retPoints[_arrayPt.length * _multiple - 1] = new Point(_arrayPt[_arrayPt.length - 1].x, _arrayPt[_arrayPt.length - 1].y);
    for (var i = 1; i < _arrayPt.length * _multiple; i++) {
        _retPoints[i] = new Point(
            i * (_arrayPt[0].x + _arrayPt[_arrayPt.length - 1].x) / (_arrayPt.length * _multiple - 1),
            i * (_arrayPt[0].x + _arrayPt[_arrayPt.length - 1].x) / (_arrayPt.length * _multiple - 1));
    }
    return _retPoints;
}


Spline.prototype.getSplineSeries = function(_applet, _t, _arrayPt, _multiple) {
    if (_arrayPt.length == 2) {
        return this.GetInterXYSeries(_t, _arrayPt, _multiple);
    }
    var _retPoints;

    var _arrayX = new Array(_arrayPt.length);
    var _arrayY = new Array(_arrayPt.length);
    for (var i = 0; i < _arrayPt.length; i++) {
        _arrayX[i] = _arrayPt[i].x;
        _arrayY[i] = _arrayPt[i].y;
    }

    var _interX = this.getSplineValues(_t, _arrayX, _multiple);
    var _interY = this.getSplineValues(_t, _arrayY, _multiple);

    var number = 1;
    var skipFrom = 1;
    for (var i = 1; i < _interX.length; i++) {
        if (_applet.dist(_interX[i], _interY[i], _interX[skipFrom], _interY[skipFrom]) < this.g_fThresholdToRemove) {} else if (_interX[i] == -1 && _interY[i] == -1) {} else {
            skipFrom = i;
            number++;
        }
    }

    _retPoints = new Array(number);
    _retPoints[0] = new Point(_interX[0], _interY[0]);

    number = 1;
    skipFrom = 1;
    for (var i = 1; i < _interX.length; i++) {
        if (_applet.dist(_interX[i], _interY[i], _interX[skipFrom], _interY[skipFrom]) < this.g_fThresholdToRemove) {} else if (_interX[i] == -1 && _interY[i] == -1) {} else {
            skipFrom = i;
            _retPoints[number] = new Point(_interX[i], _interY[i]);
            number++;
        }
    }

    return _retPoints;
}


Spline.prototype.getSplineValues = function(t, value, multiple) {
    var retValue = new Array((value.length - 1) * multiple + 1);

    var n = t.length - 1;
    var h = new Array(n);
    var b = new Array(n);
    var d = new Array(n);
    var g = new Array(n);
    var u = new Array(n);
    var r = new Array(n + 1);
    var q = new Array(n);
    var s = new Array(n);

    var i1 = 0;

    for (i1 = 0; i1 < n; i1++) {
        h[i1] = t[i1 + 1] - t[i1];
    }
    for (i1 = 1; i1 < n; i1++) {
        b[i1] = parseFloat(2.0 * (h[i1] + h[i1 - 1]));
        d[i1] = parseFloat(3.0 * ((value[i1 + 1] - value[i1]) / h[i1] - (value[i1] - value[i1 - 1]) / h[i1 - 1]));
    }
    g[1] = h[1] / b[1];
    for (i1 = 2; i1 < n - 1; i1++) {
        g[i1] = h[i1] / (b[i1] - h[i1 - 1] * g[i1 - 1]);
    }
    u[1] = d[1] / b[1];
    for (i1 = 2; i1 < n; i1++) {
        u[i1] = (d[i1] - h[i1 - 1] * u[i1 - 1]) / (b[i1] - h[i1 - 1] * g[i1 - 1]);
    }
    r[0] = 0.0;
    r[n] = 0.0;
    r[n - 1] = u[n - 1];
    for (i1 = n - 2; i1 >= 1; i1--) {
        r[i1] = u[i1] - g[i1] * r[i1 + 1];
    }

    var num = 0;
    for (var i = 0; i < value.length - 1; i++) {
        var between = t[i + 1] - t[i];
        var splineT = between / multiple;
        for (var j = 0; j < multiple; j++) {
            var sp = j * splineT;
            var qi = (value[i + 1] - value[i]) / h[i] - h[i] * (r[i + 1] + 2.0 * r[i]) / 3.0;
            var si = (r[i + 1] - r[i]) / (3.0 * h[i]);
            var y1 = value[i] + sp * (qi + sp * (r[i] + si * sp));
            retValue[num] = y1;
            num++;
        }
    }

    retValue[retValue.length - 1] = value[value.length - 1];

    return retValue;
}
