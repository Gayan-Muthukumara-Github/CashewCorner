package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.EmployeeRepository;
import com.example.cashewcorner.repository.InventoryRepository;
import com.example.cashewcorner.repository.PayrollRepository;
import com.example.cashewcorner.repository.ProductCategoryRepository;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.PurchaseOrderItemRepository;
import com.example.cashewcorner.repository.ReportRepository;
import com.example.cashewcorner.repository.SalesOrderItemRepository;
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
    return BeanInstanceSupplier.<ReportService>forConstructor(ReportRepository.class, InventoryRepository.class, SalesOrderRepository.class, PayrollRepository.class, EmployeeRepository.class, UserRepository.class, ProductRepository.class, PurchaseOrderItemRepository.class, SalesOrderItemRepository.class, ProductCategoryRepository.class, ObjectMapper.class)
            .withGenerator((registeredBean, args) -> new ReportService(args.get(0), args.get(1), args.get(2), args.get(3), args.get(4), args.get(5), args.get(6), args.get(7), args.get(8), args.get(9), args.get(10)));
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
