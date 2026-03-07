using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyNoteMD_API.Exceptions;

namespace MyNoteMD_API.Handlers
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            var problemDetails = new ProblemDetails
            {
                Instance = httpContext.Request.Path
            };

            if (exception is AppException appException)
            {
                httpContext.Response.StatusCode = (int)appException.StatusCode;
                problemDetails.Status = (int)appException.StatusCode;
                problemDetails.Title = appException.GetType().Name;

                problemDetails.Detail = appException.Message;

                if (appException is InternalServerException internalEx)
                {
                    // 500 Errors: These are logged as critical and the technical details are only provided here; they are not sent to the client.
                    _logger.LogError(exception, "Controlled Server Error (500): {TechnicalMessage} | Message Sent to the User: {SafeMessage}",
                        internalEx.TechnicalMessage, internalEx.Message);
                }
                else
                {
                    _logger.LogWarning("Operation error ({StatusCode}): {Message}",
                        appException.StatusCode, appException.Message);
                }
            }
            else
            {
                httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
                problemDetails.Status = StatusCodes.Status500InternalServerError;
                problemDetails.Title = "Server Error";

                problemDetails.Detail = "An unexpected server error occurred during your transaction. Please try again later.";

                _logger.LogError(exception, "Critical System Error: {Message}", exception.Message);
            }

            httpContext.Response.ContentType = "application/problem+json";
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            // Return True for .NET not to crash the application.
            return true;
        }
    }
}
