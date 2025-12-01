package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.PurchaseOrderRepository;
import com.example.cashewcorner.repository.SupplierRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link SupplierService}.
 */
@Generated
public class SupplierService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'supplierService'.
   */
  private static BeanInstanceSupplier<SupplierService> getSupplierServiceInstanceSupplier() {
    return BeanInstanceSupplier.<SupplierService>forConstructor(SupplierRepository.class, PurchaseOrderRepository.class)
            .withGenerator((registeredBean, args) -> new SupplierService(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'supplierService'.
   */
  public static BeanDefinition getSupplierServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SupplierService.class);
    beanDefinition.setInstanceSupplier(getSupplierServiceInstanceSupplier());
    return beanDefinition;
  }
}
