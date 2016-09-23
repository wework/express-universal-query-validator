import qs from 'querystring';
import url from 'url';
import queryValidator from '../../src/index.js';

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
});

afterEach(function () {
  this.sinon.restore();
});

describe('queryValidator', function() {
  it('queryValidator exsists', () => expect(queryValidator).is.not.undefined );
  it('queryValidator returns a function', () => expect(queryValidator()).to.be.a('function'));
});

describe('middleware', function () {
  let req;
  let res;
  let next;
  let middleware;
  let consoleError;

  beforeEach(function () {
    req = { url: '/test', path: '/test' };
    res = { redirect: this.sinon.spy() };
    next = this.sinon.spy();
    consoleError = this.sinon.stub(global.console, 'error');
  });

  describe('default redirect cb', () => {
    beforeEach(() => {
      middleware = queryValidator();
    });

    describe('actual cases', () => {
      it('handles an invalid query', () => {
        req.url = `${req.url}?utm_campaign=%E9%80%9A%E7%94%25A&utm_content=%E5%8A%9E%E5%85%AC%E5%AE%A4-%E5%87%BA%E7%A7%9F&utm_medium=cpc&utm_source=ads-baidu&utm_term=%E6%9C%8D%E5%8A%A1%E5%BC%8F%E5%B0%8F%E5%9E%8B%E5%8A%9E%E5%85%AC%E5%AE%A4`;
        middleware(req, res, next);

        expect(next).not.to.have.been.called;
        expect(res.redirect).to.have.been.calledOnce;

        const redirectUrl = res.redirect.args[0][0];
        const newQuery = qs.parse(url.parse(redirectUrl).query);

        expect(newQuery).not.to.have.property('utm_campaign');
      });

      it('handles a valid query', () => {
        req.url = `${req.url}?utm_medium=cpc&utm_source=ads-facebook&utm_campaign=l-lon-conv-smrt&utm_term=Conversion+Lookalike+GB+1%25&utm_content=90816-1&utm_id=57dbab8c1aa292c5208b4568`;
        middleware(req, res, next);

        expect(next).to.have.been.calledOnce;
        expect(res.redirect).to.not.have.been.called;
      });
    });

    it('calls next if there is no query', () => {
      middleware(req, res, next);

      expect(next).to.have.been.calledOnce;
    });

    it('calls next if query is empty', () => {
      req.url = `${req.url}?`;
      middleware(req, res, next);

      expect(next).to.have.been.calledOnce;
    });

    it('calls next if query is valid', () => {
      req.url = `${req.url}?foo=bar&baz=1`;
      middleware(req, res, next);

      expect(next).to.have.been.calledOnce;
    });

    it('does not call next if a query key is invalid', () => {
      req.url = `${req.url}?%=bar&baz=1`;
      middleware(req, res, next);

      expect(next).not.to.have.been.called;
    });

    it('does not call next if a query value is invalid', () => {
      req.url = `${req.url}?foo=%&baz=1`;
      middleware(req, res, next);

      expect(next).not.to.have.been.called;
    });

    it('does not call next if a query value is an array containing an invalid value', () => {
      req.url = `${req.url}?foo=bar&foo=%&baz=1`;
      middleware(req, res, next);

      expect(next).not.to.have.been.called;
    });

    it('redirects and drops invalid params when keys and/or values are invalid', () => {
      req.url = `${req.url}?%=bar&foo=%&arr=%E9%80%9A%E7%94%25A&arr=nope&baz=1`;

      middleware(req, res, next);
      expect(res.redirect).to.have.been.calledOnce;

      const redirectUrl = res.redirect.args[0][0];
      const newQuery = qs.parse(url.parse(redirectUrl).query);

      expect(newQuery).not.to.have.property('%');
      expect(newQuery).not.to.have.property('foo');

      expect(newQuery).to.have.property('arr');
      expect(newQuery.arr).to.eql('nope');

      expect(newQuery).to.have.property('baz');
    });
  });

  // TODO write these
  describe.skip('custom cb', () => {
    it('gets passed the correct arguments', () => {});
    it('does not get called when there is no invalid query', () => {});
    it('gets called when there is an invalid query', () => {});
    it('does not call res.redirect unless the callback explicitly does', () => {});
    it('does call res.redirect if the callback explicitly does', () => {});
  });

});