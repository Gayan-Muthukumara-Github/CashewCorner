package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.ProductCategoryRepository;
import com.example.cashewcorner.repository.ProductRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ProductService}.
 */
@Generated
public class ProductService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'productService'.
   */
  private static BeanInstanceSupplier<ProductService> getProductServiceInstanceSupplier() {
    return BeanInstanceSupplier.<ProductService>forConstructor(ProductRepository.class, ProductCategoryRepository.class)
            .withGenerator((registeredBean, args) -> new ProductService(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'productService'.
   */
  public static BeanDefinition getProductServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ProductService.class);
    beanDefinition.setInstanceSupplier(getProductServiceInstanceSupplier());
    return beanDefinition;
  }
}
