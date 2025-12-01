package org.springframework.boot.actuate.autoconfigure.ssl;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.actuate.ssl.SslHealthIndicator;
import org.springframework.boot.info.SslInfo;
import org.springframework.boot.ssl.SslBundles;

/**
 * Bean definitions for {@link SslHealthContributorAutoConfiguration}.
 */
@Generated
public class SslHealthContributorAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'sslHealthContributorAutoConfiguration'.
   */
  public static BeanDefinition getSslHealthContributorAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SslHealthContributorAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(SslHealthContributorAutoConfiguration::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'sslHealthIndicator'.
   */
  private static BeanInstanceSupplier<SslHealthIndicator> getSslHealthIndicatorInstanceSupplier() {
    return BeanInstanceSupplier.<SslHealthIndicator>forFactoryMethod(SslHealthContributorAutoConfiguration.class, "sslHealthIndicator", SslInfo.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.actuate.autoconfigure.ssl.SslHealthContributorAutoConfiguration", SslHealthContributorAutoConfiguration.class).sslHealthIndicator(args.get(0)));
  }

  /**
   * Get the bean definition for 'sslHealthIndicator'.
   */
  public static BeanDefinition getSslHealthIndicatorBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SslHealthIndicator.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.actuate.autoconfigure.ssl.SslHealthContributorAutoConfiguration");
    beanDefinition.setInstanceSupplier(getSslHealthIndicatorInstanceSupplier());
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'sslInfo'.
   */
  private static BeanInstanceSupplier<SslInfo> getSslInfoInstanceSupplier() {
    return BeanInstanceSupplier.<SslInfo>forFactoryMethod(SslHealthContributorAutoConfiguration.class, "sslInfo", SslBundles.class, SslHealthIndicatorProperties.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.actuate.autoconfigure.ssl.SslHealthContributorAutoConfiguration", SslHealthContributorAutoConfiguration.class).sslInfo(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'sslInfo'.
   */
  public static BeanDefinition getSslInfoBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SslInfo.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.actuate.autoconfigure.ssl.SslHealthContributorAutoConfiguration");
    beanDefinition.setInstanceSupplier(getSslInfoInstanceSupplier());
    return beanDefinition;
  }
}
