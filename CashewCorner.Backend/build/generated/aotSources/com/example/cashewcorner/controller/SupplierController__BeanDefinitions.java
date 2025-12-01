package com.example.cashewcorner.controller;

import com.example.cashewcorner.service.SupplierService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link SupplierController}.
 */
@Generated
public class SupplierController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'supplierController'.
   */
  private static BeanInstanceSupplier<SupplierController> getSupplierControllerInstanceSupplier() {
    return BeanInstanceSupplier.<SupplierController>forConstructor(SupplierService.class)
            .withGenerator((registeredBean, args) -> new SupplierController(args.get(0)));
  }

  /**
   * Get the bean definition for 'supplierController'.
   */
  public static BeanDefinition getSupplierControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SupplierController.class);
    beanDefinition.setInstanceSupplier(getSupplierControllerInstanceSupplier());
    return beanDefinition;
  }
}
