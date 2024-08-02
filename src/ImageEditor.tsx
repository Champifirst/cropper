import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { 
    Cropper, 
    CropperRef, 
    CropperPreview, 
    CropperPreviewRef 
} from 'react-advanced-cropper';
import { AdjustablePreviewBackground } from './compoments/AdjustablePreviewBackground.tsx';
import { Navigation } from './compoments/Navigation.tsx';
import { Slider } from './compoments/Slider.tsx';
import { AdjustableCropperBackground } from './compoments/AdjustableCropperBackground.tsx';
import { Button } from './compoments/Button.tsx';
import { ResetIcon } from './compoments/icons/ResetIcon.tsx';
import "react-advanced-cropper/dist/style.css";
import './ImageEditor.scss';

// The polyfill for Safari browser. The dynamic require is needed to work with SSR
// if (typeof window !== 'undefined') {
// 	require('context-filter-polyfill');
// }

export const ImageEditor = () => {
	const cropperRef = useRef<CropperRef>(null);
	const previewRef = useRef<CropperPreviewRef>(null);

	const [src, setSrc] = useState(require("./image.jpeg"));

	const [mode, setMode] = useState("crop");

	const [adjustments, setAdjustments] = useState({
		brightness: 0,
		hue: 0,
		saturation: 0,
		contrast: 0,
	});

	const onChangeValue = (value: number) => {
		if (mode in adjustments) {
			setAdjustments((previousValue) => ({
				...previousValue,
				[mode]: value,
			}));
		}
	};

	const onReset = () => {
		setMode('crop');
		setAdjustments({
			brightness: 0,
			hue: 0,
			saturation: 0,
			contrast: 0,
		});
	};

	const onUpload = (blob: string) => {
		onReset();
		setMode('crop');
		setSrc(blob);
	};

	const onDownload = () => {
		if (cropperRef.current) {
			const newTab = window.open();
			if (newTab) {
				newTab.document.body.innerHTML = `<img src="${cropperRef.current.getCanvas()?.toDataURL()}"/>`;
			}
		}
	};

	const onUpdate = (cropper: CropperRef) => {
		previewRef.current?.update(cropper);
	};

	const changed = Object.values(adjustments).some((el) => Math.floor(el * 100));

	const cropperEnabled = mode === 'crop';

    return (
        <div className={"image-editor"}>
          <div className="image-editor__cropper">
            <Cropper
              src={src}
              ref={cropperRef}
              stencilProps={{
                movable: cropperEnabled,
                resizable: cropperEnabled,
                lines: cropperEnabled,
                handlers: cropperEnabled,
                overlayClassName: cn(
                  "image-editor__cropper-overlay",
                  !cropperEnabled && "image-editor__cropper-overlay--faded"
                )
              }}
              backgroundWrapperProps={{
                scaleImage: cropperEnabled,
                moveImage: cropperEnabled
              }}
              backgroundComponent={AdjustableCropperBackground}
              backgroundProps={adjustments}
              onUpdate={onUpdate}
            />
            {mode !== "crop" && (
              <Slider
                className="image-editor__slider"
                value={adjustments[mode]}
                onChange={onChangeValue}
              />
            )}
            <CropperPreview
              className={"image-editor__preview"}
              ref={previewRef}
              cropper={cropperRef}
              backgroundComponent={AdjustablePreviewBackground}
              backgroundProps={adjustments}
            />
            <Button
              className={cn(
                "image-editor__reset-button",
                !changed && "image-editor__reset-button--hidden"
              )}
              onClick={onReset}
            >
              <ResetIcon />
            </Button>
          </div>
          <Navigation
            mode={mode}
            onChange={setMode}
            onUpload={onUpload}
            onDownload={onDownload}
          />
        </div>
    );
};

export default ImageEditor;