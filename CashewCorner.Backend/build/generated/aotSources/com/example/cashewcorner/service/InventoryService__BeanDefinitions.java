package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.InventoryRepository;
import com.example.cashewcorner.repository.ProductRepository;
import com.example.cashewcorner.repository.StockMovementRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link InventoryService}.
 */
@Generated
public class InventoryService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'inventoryService'.
   */
  private static BeanInstanceSupplier<InventoryService> getInventoryServiceInstanceSupplier() {
    return BeanInstanceSupplier.<InventoryService>forConstructor(InventoryRepository.class, ProductRepository.class, StockMovementRepository.class)
            .withGenerator((registeredBean, args) -> new InventoryService(args.get(0), args.get(1), args.get(2)));
  }

  /**
   * Get the bean definition for 'inventoryService'.
   */
  public static BeanDefinition getInventoryServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(InventoryService.class);
    beanDefinition.setInstanceSupplier(getInventoryServiceInstanceSupplier());
    return beanDefinition;
  }
}
