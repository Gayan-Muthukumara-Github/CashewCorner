package org.springframework.boot.actuate.autoconfigure.ssl;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.boot.info.SslInfo;
import org.springframework.boot.ssl.SslBundles;

/**
 * Bean definitions for {@link SslObservabilityAutoConfiguration}.
 */
@Generated
public class SslObservabilityAutoConfiguration__BeanDefinitions {
  /**
   * Get the bean definition for 'sslObservabilityAutoConfiguration'.
   */
  public static BeanDefinition getSslObservabilityAutoConfigurationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SslObservabilityAutoConfiguration.class);
    beanDefinition.setInstanceSupplier(SslObservabilityAutoConfiguration::new);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'sslMeterBinder'.
   */
  private static BeanInstanceSupplier<SslMeterBinder> getSslMeterBinderInstanceSupplier() {
    return BeanInstanceSupplier.<SslMeterBinder>forFactoryMethod(SslObservabilityAutoConfiguration.class, "sslMeterBinder", SslInfo.class, SslBundles.class)
            .withGenerator((registeredBean, args) -> registeredBean.getBeanFactory().getBean("org.springframework.boot.actuate.autoconfigure.ssl.SslObservabilityAutoConfiguration", SslObservabilityAutoConfiguration.class).sslMeterBinder(args.get(0), args.get(1)));
  }

  /**
   * Get the bean definition for 'sslMeterBinder'.
   */
  public static BeanDefinition getSslMeterBinderBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(SslMeterBinder.class);
    beanDefinition.setFactoryBeanName("org.springframework.boot.actuate.autoconfigure.ssl.SslObservabilityAutoConfiguration");
    beanDefinition.setInstanceSupplier(getSslMeterBinderInstanceSupplier());
    return beanDefinition;
  }
}
