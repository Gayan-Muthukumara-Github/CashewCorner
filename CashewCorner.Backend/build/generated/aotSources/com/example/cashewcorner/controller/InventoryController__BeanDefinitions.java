package com.example.cashewcorner.controller;

import com.example.cashewcorner.service.InventoryService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link InventoryController}.
 */
@Generated
public class InventoryController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'inventoryController'.
   */
  private static BeanInstanceSupplier<InventoryController> getInventoryControllerInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<InventoryController>forConstructor(InventoryService.class)
            .withGenerator((registeredBean, args) -> new InventoryController(args.get(0)));
  }

  /**
   * Get the bean definition for 'inventoryController'.
   */
  public static BeanDefinition getInventoryControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(InventoryController.class);
    beanDefinition.setInstanceSupplier(getInventoryControllerInstanceSupplier());
    return beanDefinition;
  }
}
