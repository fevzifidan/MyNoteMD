using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MyNoteMD_API
{
    public class CsrfValidationFilter : IAsyncAuthorizationFilter
    {
        private readonly IAntiforgery _antiforgery;

        public CsrfValidationFilter(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Discard GET, HEAD, OPTIONS, and TRACE Methods
            var method = context.HttpContext.Request.Method;
            if (HttpMethods.IsGet(method) || HttpMethods.IsHead(method) ||
                HttpMethods.IsOptions(method) || HttpMethods.IsTrace(method))
            {
                return;
            }

            if (context.ActionDescriptor.EndpointMetadata.Any(em => em is IgnoreAntiforgeryTokenAttribute))
            {
                return;
            }

            try
            {
                // Check Cookie and Header (X-CSRF-TOKEN)
                await _antiforgery.ValidateRequestAsync(context.HttpContext);
            }
            catch (AntiforgeryValidationException error)
            {
                Console.WriteLine(error);
                context.Result = new BadRequestObjectResult(new
                {
                    message = "Invalid or missing antiforgery token."
                });
            }
        }
    }
}
