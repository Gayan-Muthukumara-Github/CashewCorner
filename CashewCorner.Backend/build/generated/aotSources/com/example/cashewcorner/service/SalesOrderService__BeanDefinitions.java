package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.CustomerRepository;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.SalesOrderRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link SalesOrderService}.
 */
@Generated
public class SalesOrderService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'salesOrderService'.
   */
  private static BeanInstanceSupplier<SalesOrderService> getSalesOrderServiceInstanceSupplier() {
    return BeanInstanceSupplier.<SalesOrderService>forConstructor(SalesOrderRepository.class, CustomerRepository.class, ProductRepository.class)
            .withGenerator((registeredBean, args) -> new SalesOrderService(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'salesOrderService'.
   */
  public static BeanDefinition getSalesOrderServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SalesOrderService.class);
    beanDefinition.setInstanceSupplier(getSalesOrderServiceInstanceSupplier());
    return beanDefinition;
  }
}
