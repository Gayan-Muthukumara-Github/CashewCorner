package com.example.cashewcorner.service;

import com.example.cashewcorner.repository.ProductCategoryRepository;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ProductCategoryService}.
 */
@Generated
public class ProductCategoryService__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'productCategoryService'.
   */
  private static BeanInstanceSupplier<ProductCategoryService> getProductCategoryServiceInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<ProductCategoryService>forConstructor(ProductCategoryRepository.class)
            .withGenerator((registeredBean, args) -> new ProductCategoryService(args.get(0)));
  }

  /**
   * Get the bean definition for 'productCategoryService'.
   */
  public static BeanDefinition getProductCategoryServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ProductCategoryService.class);
    beanDefinition.setInstanceSupplier(getProductCategoryServiceInstanceSupplier());
    return beanDefinition;
  }
}
