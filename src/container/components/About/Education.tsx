import { Col, P14, P16, P18, P24, Row, RowBetween } from '@/components';
import { useTranslation } from 'next-i18next';

export function Education(): JSX.Element {
  const { t } = useTranslation();
  return (
    <Col className='w-full items-center justify-start border-t border-foreground/30 pt-20  mb-20'>
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 pb-20'>
        <P16>{t('about.education.title')}</P16>
        <Col className='w-full gap-10 mt-8 md:mt-0'>
          <RowBetween className='items-start w-full'>
            <Col>
              <Row className='items-end justify-start gap-1'>
                <P24 className='text-[16px] '>
                  {t('about.education.item1.school')}
                  {','}
                </P24>
                <P18 className='italic text-foreground/80 -translate-y-1'>
                  {t('about.education.item1.location')}
                </P18>
              </Row>
              <P14>{t('about.education.item1.diploma')}</P14>
            </Col>
            <P16 className='text-[12px] md:text-[15px]'>
              {t('about.education.item1.year')}
            </P16>
          </RowBetween>
          <RowBetween className='items-start w-full'>
            <Col>
              <Row className='items-end justify-start gap-1'>
                <P24 className=''>
                  {t('about.education.item2.school')}
                  {','}
                </P24>
                <P18 className='italic text-foreground/80 -translate-y-1'>
                  {t('about.education.item2.location')}
                </P18>
              </Row>
              <P14>{t('about.education.item2.diploma')}</P14>
            </Col>
            <P16 className='text-[12px] md:text-[15px]'>
              {t('about.education.item2.year')}
            </P16>
          </RowBetween>
          <RowBetween className='items-start w-full'>
            <Col>
              <Row className='items-end justify-start gap-1'>
                <P24 className=''>
                  {t('about.education.item3.school')}
                  {','}
                </P24>
                <P18 className='italic text-foreground/80 -translate-y-1'>
                  {t('about.education.item3.location')}
                </P18>
              </Row>
              <P14>{t('about.education.item3.diploma')}</P14>
            </Col>
            <P16 className='text-[12px] md:text-[15px]'>
              {t('about.education.item3.year')}
            </P16>
          </RowBetween>
        </Col>
      </RowBetween>
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 border-t border-b border-foreground/30 pt-20 pb-20'>
        <P16>{t('about.experience.title')}</P16>
        <Col className='w-full gap-10 mt-8 md:mt-0'>
          <RowBetween className='items-start w-full'>
            <Col>
              <Row className='items-end justify-start gap-1'>
                <P24 className=''>
                  {t('about.experience.item1.company')}
                  {','}
                </P24>
                <P18 className='italic text-foreground/80 -translate-y-1'>
                  {t('about.experience.item1.location')}
                </P18>
              </Row>
              <P14>{t('about.experience.item1.description')}</P14>
            </Col>
            <P16 className='text-[12px] md:text-[15px]'>
              {t('about.experience.item1.year')}
            </P16>
          </RowBetween>
          <RowBetween className='items-start w-full'>
            <Col>
              <Row className='items-end justify-start gap-1'>
                <P24 className=''>
                  {t('about.experience.item2.company')}
                  {','}
                </P24>
                <P18 className='italic text-foreground/80 -translate-y-1'>
                  {t('about.experience.item2.location')}
                </P18>
              </Row>
              <P14>{t('about.experience.item2.description')}</P14>
            </Col>
            <P16 className='text-[12px] md:text-[15px]'>
              {t('about.experience.item2.year')}
            </P16>
          </RowBetween>
        </Col>
      </RowBetween>
    </Col>
  );
}
