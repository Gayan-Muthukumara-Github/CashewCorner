package com.example.cashewcorner.controller;

import com.example.cashewcorner.service.ProductCategoryService;
import com.example.cashewcorner.service.ProductService;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ProductController}.
 */
@Generated
public class ProductController__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'productController'.
   */
  private static BeanInstanceSupplier<ProductController> getProductControllerInstanceSupplier() {
    return BeanInstanceSupplier.<ProductController>forConstructor(ProductService.class, ProductCategoryService.class)
            .withGenerator((registeredBean, args) -> new ProductController(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'productController'.
   */
  public static BeanDefinition getProductControllerBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ProductController.class);
    beanDefinition.setInstanceSupplier(getProductControllerInstanceSupplier());
    return beanDefinition;
  }
}
