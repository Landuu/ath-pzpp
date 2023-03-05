namespace PZPP.Backend.Utils.Results
{
    public class UnauthorizedDeleteCookieResult : IResult
    {
        private readonly string[] _cookieKeys;

        public UnauthorizedDeleteCookieResult(params string[] cookieKey)
        {
            _cookieKeys = cookieKey;
        }

        public Task ExecuteAsync(HttpContext httpContext)
        {
            foreach(string key in _cookieKeys)
                httpContext.Response.Cookies.Delete(key);
            httpContext.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    }
}
