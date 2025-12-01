package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.EmployeeRepository;
import com.example.cashewcorner.repository.InventoryRepository;
import com.example.cashewcorner.repository.PayrollRepository;
import com.example.cashewcorner.repository.ReportRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
import com.example.cashewcorner.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ReportService}.
 */
@Generated
public class ReportService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'reportService'.
   */
  private static BeanInstanceSupplier<ReportService> getReportServiceInstanceSupplier() {
    return BeanInstanceSupplier.<ReportService>forConstructor(ReportRepository.class, InventoryRepository.class, SalesOrderRepository.class, PayrollRepository.class, EmployeeRepository.class, UserRepository.class, ObjectMapper.class)
            .withGenerator((registeredBean, args) -> new ReportService(args.get(0), args.get(1), args.get(2), args.get(3), args.get(4), args.get(5), args.get(6)));
  }

  /**
   * Get the bean definition for 'reportService'.
   */
  public static BeanDefinition getReportServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ReportService.class);
    beanDefinition.setInstanceSupplier(getReportServiceInstanceSupplier());
    return beanDefinition;
  }
}
