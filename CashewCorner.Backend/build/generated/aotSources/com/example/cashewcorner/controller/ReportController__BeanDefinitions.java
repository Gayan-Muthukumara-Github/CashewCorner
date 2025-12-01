package com.example.cashewcorner.controller;

import com.example.cashewcorner.service.ReportService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ReportController}.
 */
@Generated
public class ReportController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'reportController'.
   */
  private static BeanInstanceSupplier<ReportController> getReportControllerInstanceSupplier() {
    return BeanInstanceSupplier.<ReportController>forConstructor(ReportService.class)
            .withGenerator((registeredBean, args) -> new ReportController(args.get(0)));
  }

  /**
   * Get the bean definition for 'reportController'.
   */
  public static BeanDefinition getReportControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReportController.class);
    beanDefinition.setInstanceSupplier(getReportControllerInstanceSupplier());
    return beanDefinition;
  }
}
