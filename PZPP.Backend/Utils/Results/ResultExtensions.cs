namespace PZPP.Backend.Utils.Results
{
    public static class ResultExtensions
    {
        public static IResult UnauthorizedDeleteCookie(this IResultExtensions extensions, params string[] cookieKey)
        {
            return new UnauthorizedDeleteCookieResult(cookieKey);
        }
    }
}
