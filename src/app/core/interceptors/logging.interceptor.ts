import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  console.log(`[HTTP] Request ${req.method} ${req.url} started at ${new Date().toISOString()}`);

  return next(req).pipe(
    finalize(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`[HTTP] Request ${req.method} ${req.url} completed in ${duration}ms`);
    })
  );
};
